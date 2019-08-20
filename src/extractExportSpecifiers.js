function getSimpleType(type) {
    switch (type) {
        case 'ExportDefaultSpecifier':
            return 'default';
        default:
            return 'named';
    }
}

module.exports = (declarations, resolve) => {
    const exps = [];

    declarations.forEach(node => {
        const specifiers = node.specifiers || [];
        const importPath = node.source ? resolve(node.source.value) : null;

        specifiers.forEach(specifier => {
            exps.push({
                type: getSimpleType(specifier.type),
                name: specifier.local.name,
                path: importPath,
                exportedName: (specifier.exported || specifier.local).name,
            });
        });
    });

    return exps;
};
