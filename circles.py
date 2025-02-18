import matplotlib.pyplot as plt
import numpy as np

def hex_rings(rings, circle_radius=1):
    """
    Draws a central circle and concentric hexagonal rings.
    
    The center is at (0,0) and the pattern is based on axial coordinates (q, r)
    with the conversion:
        x = 2*q + r
        y = sqrt(3)*r
    so that the distance between touching circles is 2.
    
    For rings == 3, you get the center plus 3 rings with counts 6, 12, and 18 circles.
    """
    fig, ax = plt.subplots()
    ax.set_aspect('equal')
    
    # Store circles for event handling
    circles = []
    
    # Iterate over axial coordinates in the hexagon of radius "rings"
    for q in range(-rings, rings + 1):
        # r is bounded such that q, r, and s == (-q-r) satisfy hex distance <= rings.
        r_min = max(-rings, -q - rings)
        r_max = min(rings, -q + rings)
        for r in range(r_min, r_max + 1):
            # Compute hex distance (ring number) using axial coordinates.
            d = max(abs(q), abs(r), abs(q + r))
            if d <= rings:
                # Convert axial (q, r) to Cartesian coordinates using our basis:
                # v1 = (2, 0) and v2 = (1, sqrt(3))
                x = 2 * q + r
                y = np.sqrt(3) * r
                circle = plt.Circle((x, y), circle_radius,
                                    facecolor='white', edgecolor='black')
                ax.add_patch(circle)
                circles.append(circle)
    
    # Set the limits to provide a margin around the pattern
    margin = 2 * rings + 1
    ax.set_xlim(-margin, margin)
    ax.set_ylim(-margin, margin)
    
    def on_click(event):
        for circle in circles:
            contains, _ = circle.contains(event)
            if contains:
                current_color = circle.get_facecolor()
                if current_color == (1.0, 1.0, 1.0, 1.0):  # white
                    new_color = 'black'
                elif current_color == (0.0, 0.0, 0.0, 1.0):  # black
                    new_color = 'gray'
                else:  # gray
                    new_color = 'white'
                circle.set_facecolor(new_color)
                fig.canvas.draw_idle()
                break

    fig.canvas.mpl_connect('button_press_event', on_click)
    plt.axis('off')
    plt.show()

# Draw the hexagonally packed circles: center + 3 rings (6, 12, 18 circles respectively)
hex_rings(3, circle_radius=1)