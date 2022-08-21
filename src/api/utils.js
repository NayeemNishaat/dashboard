import isNil from "lodash/isNil";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import mergeWith from "lodash/mergeWith";

export async function getRemoteImageRatio(url) {
  var img = new Image();
  img.addEventListener("load", function() {
    return getRatio(this.naturalWidth, this.naturalHeight);
  });
  img.addEventListener("error", function() {
    return "";
  });
  img.src = url;
}

function greatestCommonDivisor(width, height) {
  return height == 0 ? width : greatestCommonDivisor(height, width % height);
}

export function getRatio(width, height) {
  const gcd = greatestCommonDivisor(width, height);
  return `${width / gcd}:${height / gcd}`;
}

export async function getImageRatio(file) {
  const fr = new FileReader();
  fr.onload = () => {
    const img = new Image();
    img.onload = () => {
      const ratio = getRatio(img.width, img.height);
      return ratio;
    };
    img.onerror = e => {
      throw e;
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
}

export function nilDefaultsDeep(...args) {
  const nilMerge = (a, b) => (isNil(a) ? b : a);
  const nilMergeDeep = (a, b) =>
    isObject(a) && !isArray(a)
      ? mergeWith({}, a, b, nilMergeDeep)
      : nilMerge(a, b);

  return mergeWith(...args, nilMergeDeep);
}
