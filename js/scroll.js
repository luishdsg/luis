gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
smoothScroll("#content");
function smoothScroll(content, viewport, smoothness) {
      content = gsap.utils.toArray(content)[0];

      gsap.set(viewport || content.parentNode, {
            overflow: "hidden",
            position: "fixed",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
      });
      gsap.set(content, { overflow: "visible", width: "100%" });

      let getProp = gsap.getProperty(content),
            setProp = gsap.quickSetter(content, "y", "px"),
            removeScroll = () => (content.style.overflow = "visible"),
            needsRefreshFix =
                  parseFloat(
                        ScrollTrigger.version
                              .split(".")
                              .map((n) => ("00" + n).substr(n.length - 1, 3))
                              .join("")
                  ) < 3006002,
            height;

      function onResize() {
            height = content.clientHeight;
            content.style.overflow = "visible";
            document.body.style.height = height + "px";
      }
      onResize();
      ScrollTrigger.addEventListener("refreshInit", onResize);
      ScrollTrigger.addEventListener("refresh", () => {
            removeScroll();
            requestAnimationFrame(removeScroll);
      });

      ScrollTrigger.defaults({ scroller: content });

      ScrollTrigger.prototype.update = (p) => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)

      ScrollTrigger.scrollerProxy(content, {
            scrollTop(value) {
                  return arguments.length ? setProp(-value) : -getProp("y");
            },
            getBoundingClientRect() {
                  return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                  };
            }
      });

      gsap.fromTo(
            content,
            { y: 0 },
            {
                  y: () => document.documentElement.clientHeight - height,
                  ease: "none",
                  onUpdate: ScrollTrigger.update,
                  scrollTrigger: {
                        scroller: window,
                        invalidateOnRefresh: true,
                        start: 0,
                        end: () => height - document.documentElement.clientHeight,
                        scrub: smoothness || 3,
                        onRefresh: (self) => {
                              // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
                              gsap.killTweensOf(self.animation);
                              self.animation.progress(self.progress);
                              if (needsRefreshFix) {
                                    let all = ScrollTrigger.getAll();
                                    all.slice(all.indexOf(self) + 1).forEach((t) => t.refresh());
                              }
                        }
                  }
            }
      );
}
document.addEventListener("DOMContentLoaded", function () {
    smoothScroll();
});