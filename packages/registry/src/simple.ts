export type SimpleRegistry = {
    /// The key should be the normalized IRI
    [key: string]: RegistryItem
}

/// A registry item is either a function (for JIT module loading) or a react node to render
export type RegistryItem = Function | React.ReactNode

// TODO: maybe add more restrictions on the proptypes of this node, to explicitly include sweb data

// think about cyclic data
