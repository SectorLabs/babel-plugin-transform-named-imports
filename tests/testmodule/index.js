import myFunc from './myFunc';
import { myOtherOtherFunc } from './reexport';

export {
    myFunc,
    myOtherOtherFunc as myOtherFunc,
};

export default () => console.log('default export');
