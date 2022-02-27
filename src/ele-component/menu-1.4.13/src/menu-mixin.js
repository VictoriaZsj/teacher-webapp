export default {
  computed: {
    indexPath() {
      var path = [this.index];
      var parent = this.$parent;
      while (parent.$options.componentName !== 'ElMenuNew') {
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    rootMenu() {
      var parent = this.$parent;
      while (
        parent &&
        parent.$options.componentName !== 'ElMenuNew'
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
    parentMenu() {
      let parent = this.$parent;
      while (
        parent &&
        ['ElMenuNew', 'ElSubmenuNew'].indexOf(parent.$options.componentName) === -1
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
    paddingStyle() {
      if (this.rootMenu.mode !== 'vertical') return {};

      let padding = 25;
      let parent = this.$parent;

      if (this.rootMenu.collapse) {
        padding = 25;
      } else {
        while (parent && parent.$options.componentName !== 'ElMenuNew') {
          if (parent.$options.componentName === 'ElSubmenuNew') {
            padding += 27;
          }
          parent = parent.$parent;
        }
      }
      return {paddingLeft: padding + 'px'};
    }
  }
};
