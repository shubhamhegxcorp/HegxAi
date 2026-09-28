import os
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

def process_hand_image(input_path: str, output_path: str, lum_threshold: float = 0.85, blur_radius: float = 3.0, min_component_size: int = 150):
    print(f"Processing {input_path} -> {output_path}")
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img)
    H, W, _ = arr.shape

    # 1. Grayscale luminance
    # Luminance formula: 0.299 R + 0.587 G + 0.114 B
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

    # 2. Gaussian blur on a copy to smooth out halftone dots for mask building
    gray_img = Image.fromarray((gray * 255).astype(np.uint8))
    blurred_img = gray_img.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    blurred_lum = np.array(blurred_img) / 255.0

    # 3. Mark candidate background where blurred luminance > lum_threshold
    is_candidate_bg = (blurred_lum > lum_threshold)

    # 4. Flood fill from image edges so only border-connected background is removed
    is_true_bg = np.zeros((H, W), dtype=bool)
    queue = deque()

    # Border seeds
    for y in range(H):
        if is_candidate_bg[y, 0] and not is_true_bg[y, 0]:
            is_true_bg[y, 0] = True
            queue.append((y, 0))
        if is_candidate_bg[y, W - 1] and not is_true_bg[y, W - 1]:
            is_true_bg[y, W - 1] = True
            queue.append((y, W - 1))

    for x in range(W):
        if is_candidate_bg[0, x] and not is_true_bg[0, x]:
            is_true_bg[0, x] = True
            queue.append((0, x))
        if is_candidate_bg[H - 1, x] and not is_true_bg[H - 1, x]:
            is_true_bg[H - 1, x] = True
            queue.append((H - 1, x))

    while queue:
        cy, cx = queue.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < H and 0 <= nx < W:
                if is_candidate_bg[ny, nx] and not is_true_bg[ny, nx]:
                    is_true_bg[ny, nx] = True
                    queue.append((ny, nx))

    # 5. Foreground mask (not border-connected background)
    is_fg = ~is_true_bg

    # 6. Remove isolated foreground specks smaller than min_component_size
    visited = np.zeros((H, W), dtype=bool)
    dropped_specks = 0

    for y in range(H):
        for x in range(W):
            if is_fg[y, x] and not visited[y, x]:
                comp_pixels = []
                comp_queue = deque([(y, x)])
                visited[y, x] = True

                while comp_queue:
                    py, px = comp_queue.popleft()
                    comp_pixels.append((py, px))
                    for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                        qy, qx = py + dy, px + dx
                        if 0 <= qy < H and 0 <= qx < W:
                            if is_fg[qy, qx] and not visited[qy, qx]:
                                visited[qy, qx] = True
                                comp_queue.append((qy, qx))

                if len(comp_pixels) < min_component_size:
                    for py, px in comp_pixels:
                        is_fg[py, px] = False
                    dropped_specks += 1

    print(f"  Dimensions: {W}x{H}, dropped isolated specks: {dropped_specks}")
    print(f"  Foreground pixels kept: {np.count_nonzero(is_fg)} / {H * W}")

    # 7. Write result with true alpha (background alpha = 0)
    output_arr = arr.copy()
    output_arr[~is_fg, 3] = 0

    output_img = Image.fromarray(output_arr)
    output_img.save(output_path, 'PNG')
    print(f"  Saved to {output_path}")

if __name__ == '__main__':
    base_dir = r"d:\hegxai anti\hegxai\public\assets"
    robot_in = os.path.join(base_dir, "robot-hand.png")
    robot_out = os.path.join(base_dir, "robot-hand-clean.png")

    human_in = os.path.join(base_dir, "human-hand.png")
    human_out = os.path.join(base_dir, "human-hand-clean.png")

    # Robot hand background min blurred lum is ~0.91 -> threshold 0.88 captures full background
    process_hand_image(robot_in, robot_out, lum_threshold=0.88, blur_radius=3.0, min_component_size=150)
    # Human hand background min blurred lum is ~0.949 -> threshold 0.92 preserves delicate knuckles and wrist contours
    process_hand_image(human_in, human_out, lum_threshold=0.92, blur_radius=3.0, min_component_size=150)
    print("Preprocessing completed successfully!")
