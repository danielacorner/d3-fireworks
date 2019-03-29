// select the svg, get width and height
const svg = d3.select('svg');
const svgBbox = svg.node().getBoundingClientRect();
const svgWidth = svgBbox.width;
const svgHeight = svgBbox.height;

// append launcher
const launcher = svg.append('rect').attr('class', 'launcher');

// style launcher
const LAUNCHER_WIDTH = 15;
const LAUNCHER_HEIGHT = 50;
launcher.attrs({
  width: `${LAUNCHER_WIDTH}px`,
  height: `${LAUNCHER_HEIGHT}px`,
  fill: 'tomato',
  x: (svgWidth - LAUNCHER_WIDTH) / 2,
  y: svgHeight - LAUNCHER_HEIGHT,
});

// (launcher is offset by the border + half the launcher width)
const launcherOffset = window.innerWidth * 0.1 + LAUNCHER_WIDTH / 2;

// move launcher on mousemove
const handleMouseMove = () => {
  // get the mouse coordinates
  const mouseX = d3.event.pageX;
  const mouseY = d3.event.pageY;

  // move the launcher to the mouse position
  launcher.attr('x', mouseX - launcherOffset);
};

const handleClick = () => {
  const [mouseX, mouseY] = [d3.event.pageX, d3.event.pageY];
  console.log(mouseY);
  // get launcher position
  const launcherBbox = launcher.node().getBoundingClientRect();

  // launch a firework!
  const FIREWORK_DURATION_MS = 1000;
  const EXPLOSION_DURATION_MS = 500;
  const EXPLOSION_Y = mouseY - window.innerHeight * 0.1;
  const START_X = launcherBbox.x - launcherOffset - 1;

  // append the firework
  svg
    .append('rect')
    .attrs({
      fill: 'white',
      height: 15,
      width: 2,
      x: START_X,
      y: launcher.attr('y'),
    })
    // transition it to the target
    .transition()
    .duration(FIREWORK_DURATION_MS)
    .attrs({
      y: EXPLOSION_Y,
    })
    .styles({
      opacity: 0,
    })
    // remove it from the page because it's unused
    .remove();

  // explode after the firework hits the target
  setTimeout(() => {
    // append a circle to the target position
    svg
      .append('circle')
      // give it a transparent background, a white border 1px wide
      .attrs({
        cy: EXPLOSION_Y,
        cx: START_X,
        fill: 'transparent',
        stroke: 'white',
        'stroke-width': 1,
      })
      // transition its radius up and its opacity to 0, then remove it
      .transition()
      .duration(EXPLOSION_DURATION_MS)
      .attrs({
        r: 20,
      })
      .styles({
        opacity: 0,
      })
      .remove();

    // append a line to the target position
    for (let i = 0; i < 30; i++) {
      svg
        .append('line')
        .attrs({
          // lines have x1 y1, x2 y2 for the start and end coords
          // start at the target
          x1: START_X,
          y1: EXPLOSION_Y,
          x2: START_X,
          y2: EXPLOSION_Y,
          // the stroke is a random hue, 90% saturation, 80% lightness
          stroke: `hsl(${Math.random() * 360},90%,80%)`,
          'stroke-width': 1,
        })
        .transition()
        .duration(EXPLOSION_DURATION_MS)
        .attrs({
          x2: START_X + 150 * Math.random() * (Math.random() > 0.5 ? 1 : -1),
          y2:
            EXPLOSION_Y + 150 * Math.random() * (Math.random() > 0.5 ? 1 : -1),
        })
        .styles({
          opacity: 0,
        })
        .remove();
    }
  }, FIREWORK_DURATION_MS);
};

svg
  .on('mousemove', handleMouseMove)
  .on('click', handleClick)
  .on('mousedown', handleMouseDown)
  .on('mouseup', handleMouseUp);
