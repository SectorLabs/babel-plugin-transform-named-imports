import myFunc from './myFunc';
import { myOtherOtherFunc } from './reexport';
import * as things from './constants';

export {
    myFunc,
    myOtherOtherFunc as myOtherFunc,
    things as thangs,
};

export default () => console.log('default export');
