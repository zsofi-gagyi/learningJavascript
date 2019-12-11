<h3>Breakout clone</h3>

Based on the Breakout arcade game from 1976 (see on <a href="https://en.wikipedia.org/wiki/Breakout_clone">wikipedia</a>).

With randomly generated levels and enemy blocks which have "lives" (need to be touched multiple times to be destroyed).

Built using data binding, and two versions of a game loop: one which keeps updating at a fixed time step (with synchronization), 
and one with a variable time step.

Incorporating Peter Kelley's
        <a href="https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js">
          function
        </a>
for finding if two line segments intersect (for collision detection in the variable time step version).
