<h1>Breakout clone</h1>
<h3>Try it <a href="https://zsofi-gagyi.github.io/learningJavascript/">here</a></h3>

Based on the Breakout arcade game from 1976 (see on <a href="https://en.wikipedia.org/wiki/Breakout_clone">wikipedia</a>).

With randomly generated levels and enemy blocks which have "lives" (need to be touched multiple times to be destroyed).

Built using data binding, and two versions of a game loop: one which keeps updating at a fixed time step (with synchronization), 
and one with a variable time step.

Incorporating (and modifying a bit in order to make it fit) Timm Preetz's
        <a href="https://gist.github.com/tp/75cb619a7e40e6ad008ef2a6837bbdb2">
          Gist</a>
for finding if two line segments intersect (for collision detection in the variable time step version).
