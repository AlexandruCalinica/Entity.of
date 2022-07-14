export function derive(source: any) {
  return function (output: () => any) {
    return output.bind(source)();
  };
}
