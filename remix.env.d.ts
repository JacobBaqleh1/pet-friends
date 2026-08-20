/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare namespace JSX {
  interface IntrinsicElements {
    "pet-scroller": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
