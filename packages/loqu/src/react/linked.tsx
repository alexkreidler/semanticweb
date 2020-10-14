import React from "react"
import { renderSingleComponent, SemanticComponent } from "../data"
import { Registry } from "../registry"

export const linked = (comp: SemanticComponent<any> | React.ComponentType): React.ComponentType => {
    if ("id" in comp) {
        Registry.register(comp)
        const x = () => <>{renderSingleComponent(comp, null)}</>
        return x
    } else {
        throw new Error("Whoops, can't register a plain react component. You need a SemanticComponent")
    }
}

type PropsAreEqual<P> = (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean

export function withTheme<T extends WithThemeProps = WithThemeProps>(WrappedComponent: React.ComponentType<T>) {
    // Try to create a nice displayName for React Dev Tools.
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component"

    // Creating the inner component. The calculated Props type here is the where the magic happens.
    const ComponentWithTheme = (props: Omit<T, keyof WithThemeProps>) => {
        // Fetch the props you want to inject. This could be done with context instead.
        const themeProps = { hey: "ther" }

        // props comes afterwards so the can override the default ones.
        return <WrappedComponent {...themeProps} {...(props as T)} />
    }

    ComponentWithTheme.displayName = `withTheme(${displayName})`

    return ComponentWithTheme
}
interface WithThemeProps {
    primaryColor: string
}
interface Props extends WithThemeProps {
    children: React.ReactNode
}

class MyButton extends React.Component<Props> {
    public render() {
        return "hey"
        // Render an the element using the theme and other props.
    }

    private someInternalMethod() {
        // The theme values are also available as props here.
    }
}

export default withTheme(MyButton)
