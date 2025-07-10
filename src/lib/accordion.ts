export function accordion(node, isOpen: boolean) {
  let initialHeight = node.offsetHeight;
  node.style.height = isOpen ? 'auto' : 0;
  node.style.overflow = 'hidden';
  return {
    update(isOpen) {
      let animation = node.animate(
        [
          {
            opacity: 100,
            height: initialHeight + 'px',
            overflow: 'hidden'
          },
          {
            opacity: 0,
            height: 0,
            overflow: 'hidden'
          }
        ],
        { duration: 175, fill: 'both' }
      );
      animation.pause();
      if (!isOpen) {
        animation.play();
      } else {
        animation.reverse();
      }
    }
  };
}
