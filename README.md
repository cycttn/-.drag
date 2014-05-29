-.drag
======

jQuery Plugin for Drag

For more, see http://js.lovelotte.net/jQ/drag


Overview
===============
Quick plugin that allows optionally constrained dragging of an element. The element can be constrained within a box, or in a certain dimension (x or y). The following events are triggered:
- drag::dragStart - when dragging starts
- drag::dragEnd - when dragging has ended
- drag::dragging - when dragging, provides the amount of drag in pixels (dx, dy). 

For example, [dx,dy] can be used to determine if overlap has occurred, or to implement scrollbars (determining how much scroll has occured). 
