export function resolvingPromise() {
  return new Promise(resolve => {
    resolve();
  });
}

export const elementStubs = {
  elSwitch: true,
  elCollapseItem: true,
  elCollapse: true,
  elCheckbox: true,
  elButton: true,
  elRadio: true,
  elRadioGroup: true,
  elSlider: true,
  elForm: true,
  elFormItem: true,
  elAlert: true,
  elTag: true,
  elInputNumber: true,
  elProgress: true
};

export function getNewObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}
