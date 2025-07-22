function template(
  { imports, interfaces, componentName, props, jsx, exports },
  { tpl },
) {
  return tpl`
    ${imports};
    ${interfaces};

    const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => (
      ${jsx}
    );

    ${componentName}.displayName = '${componentName}';

    export { ${componentName} };
  `;
}

module.exports = template;