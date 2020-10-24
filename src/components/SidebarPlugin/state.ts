import { reactive, readonly, inject } from "vue";

export const sidebarSymbol = Symbol("sidebar");

export const getSidebar = (): sidebar => {
  const sidebar: sidebar | undefined = inject(sidebarSymbol);
  if (!sidebar) {
    throw new Error("could not load sidebar component");
  }
  return sidebar;
};

interface sidebar {
  displaySidebar: (value: boolean) => boolean;
  state: {
    showSidebar: boolean;
    sidebarLinks: Readonly<Array<any>>;
  };
}
export const createSidebar = (): sidebar => {
  const state = reactive({
    showSidebar: false,
    sidebarLinks: [] as Array<any>
  });
  const displaySidebar = (value: boolean) => (state.showSidebar = value);
  return { displaySidebar, state: readonly(state) };
};
