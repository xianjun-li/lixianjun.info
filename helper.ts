export function transPath(str: string, t: Function, ds = "/"): string {
    return str
      .split(ds)
      .map(s => t(s))
      .join(ds)
  }