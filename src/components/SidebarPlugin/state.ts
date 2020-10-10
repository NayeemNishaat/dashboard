import { reactive, readonly, inject } from "vue";

export const stateSidebar = Symbol("sidebar");

export const useState = (): void => inject(stateSidebar);
// export const provideState = () => provide(stateSidebar, createState());

export const createState = (): {
  displaySidebar: (value: boolean) => boolean;
  state: {
    showSidebar: boolean;
    sidebarLinks: any;
  };
} => {
  const state = reactive({
    showSidebar: false,
    sidebarLinks: [] as Array<any>
  });
  const displaySidebar = (value: boolean) => (state.showSidebar = value);
  return { displaySidebar, state: readonly(state) };
};
