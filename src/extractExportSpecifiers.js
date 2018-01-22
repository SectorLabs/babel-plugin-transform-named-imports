module.exports = (declarations, resolve) => {
    const exps = [];

    declarations.forEach(node => {
        const specifiers = node.specifiers || [];

        specifiers.forEach(specifier => {
            exps.push({
                type: specifier.type === 'ExportDefaultSpecifier'
                    ? 'default' : 'named',
                name: specifier.local.name,
                exportedName: (specifier.exported || specifier.local).name,
            });
        });
    });

    return exps;
};
