export function enumerable(target, name, descriptor) {
    descriptor.enumerable = true
    return descriptor
}
export function noenumerable(target, name, descriptor) {
    descriptor.enumerable = false
    return descriptor
}