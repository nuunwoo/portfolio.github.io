const template = (variables, { tpl }) => {
  const componentName = variables.componentName.startsWith("Svg")
    ? variables.componentName.slice(3)
    : variables.componentName;

  return tpl`
${variables.imports.slice(1)}
${variables.interfaces}
const ${componentName} = (${variables.props}) => (
  ${variables.jsx}
);

export default ${componentName};
`;
};

module.exports = template;
