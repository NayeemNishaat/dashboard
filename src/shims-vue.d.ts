declare module "*.vue" {
  import { DefineComponent } from "vue";
  // const Component: ReturnType<typeof defineComponent>;
  const component: DefineComponent<any, any, any>;
  export default component;
}
