document.getElementById('replay').addEventListener('click', function() {
    // Set the coordinates of the original point back to origin
    point.features[0].geometry.coordinates = origin;

    // Update the source layer
    map.getSource('point').setData(point);

    // Reset the counter
    counter = 0;

    // Restart the animation.
    animate(counter);
});
