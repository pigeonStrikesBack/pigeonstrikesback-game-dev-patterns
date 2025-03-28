// Function to convert HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue)
export function hsvToRgb(h, s, v) {
    // Calculate the chroma (c) - the intensity of the color
    let c = v * s;
    
    // Calculate the intermediate value (x) based on the hue
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    
    // Calculate the match value (m) - this is the adjustment to get the RGB values within the correct range
    let m = v - c;

    // Determine the RGB values based on the hue range (which is divided into 6 sectors)
    // For each sector of the hue, we compute a different combination of the RGB values
    let [r, g, b] = (h < 60) ? [c, x, 0] :        // Red is dominant (0° to 60°)
                    (h < 120) ? [x, c, 0] :      // Green is dominant (60° to 120°)
                    (h < 180) ? [0, c, x] :      // Green is dominant (120° to 180°)
                    (h < 240) ? [0, x, c] :      // Blue is dominant (180° to 240°)
                    (h < 300) ? [x, 0, c] :      // Red is dominant (240° to 300°)
                                [c, 0, x];        // Blue is dominant (300° to 360°)

    // Adjust the RGB values by adding the match value (m) and convert to a range of 0-255
    // The Math.round ensures the values are rounded to the nearest integer
    return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
}

// Function to generate a random HSV color
export function getRandomHSVColor() {
    // Random hue between 0 and 360 degrees
    let h = Math.random() * 360;  // Hue: 0-360 degrees

    // Random saturation between 0.7 (70%) and 1 (100%)
    let s = 0.7 + Math.random() * 0.3;  // Saturation: 70-100%

    // Random value (brightness) between 0.7 (70%) and 1 (100%)
    let v = 0.7 + Math.random() * 0.3;  // Brightness: 70-100%

    // Convert the randomly generated HSV values to RGB and return the result
    return hsvToRgb(h, s, v);
}
