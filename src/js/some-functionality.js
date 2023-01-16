
/**
 * Create any JS code you require, export it and import where required
 */
export class SomeFunctionality {

    logSomething() {
        console.log(`method has been called in SomeFunctionality`);

        this.thisIsAPrivateMethod(`parameter`);
    }

    thisIsAPrivateMethod = (param) => {
        console.log(`this is logged from a private method, called from public method \`SomeFunctionality.logSomething\` with ${param}`);
    }
}