function getSimpleType(type) {
    switch (type) {
    case 'ImportDefaultSpecifier':
        return 'default';
    case 'ImportNamespaceSpecifier':
        return 'namespace';
    default:
        return 'named';
    }
}

module.exports = (declarations, resolve) => {
    const imports = [];

    declarations.forEach(importNode => {
        const importPath = resolve(importNode.source.value);
        const specifiers = importNode.specifiers || [];

        specifiers.forEach(specifier => {
            imports.push({
                type: getSimpleType(specifier.type),
                path: importPath,
                name: specifier.local.name,
                importedName: (specifier.imported || specifier.local).name,
                originalPath: importNode.source.value,
            });
        });
    });

    return imports;
};
