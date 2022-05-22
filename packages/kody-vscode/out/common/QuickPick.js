"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiStepInput = void 0;
const vscode_1 = require("vscode");
/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 *
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
async function multiStepInput(context) {
    class MyButton {
        constructor(iconPath, tooltip) {
            this.iconPath = iconPath;
            this.tooltip = tooltip;
        }
    }
    const createResourceGroupButton = new MyButton({
        dark: vscode_1.Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
        light: vscode_1.Uri.file(context.asAbsolutePath('resources/light/add.svg')),
    }, 'Create Resource Group');
    const resourceGroups = [
        'vscode-data-function',
        'vscode-appservice-microservices',
        'vscode-appservice-monitor',
        'vscode-appservice-preview',
        'vscode-appservice-prod',
    ].map(label => ({ label }));
    async function collectInputs() {
        const state = {};
        await MultiStepInput.run(input => pickResourceGroup(input, state));
        return state;
    }
    const title = 'Create Application Service';
    async function pickResourceGroup(input, state) {
        const pick = await input.showQuickPick({
            title,
            step: 1,
            totalSteps: 3,
            placeholder: 'Pick a resource group',
            items: resourceGroups,
            activeItem: typeof state.resourceGroup !== 'string'
                ? state.resourceGroup
                : undefined,
            buttons: [createResourceGroupButton],
            shouldResume: shouldResume,
        });
        if (pick instanceof MyButton) {
            return (input) => inputResourceGroupName(input, state);
        }
        state.resourceGroup = pick;
        return (input) => inputName(input, state);
    }
    async function inputResourceGroupName(input, state) {
        state.resourceGroup = await input.showInputBox({
            title,
            step: 2,
            totalSteps: 4,
            value: typeof state.resourceGroup === 'string' ? state.resourceGroup : '',
            prompt: 'Choose a unique name for the resource group',
            validate: validateNameIsUnique,
            shouldResume: shouldResume,
        });
        return (input) => inputName(input, state);
    }
    async function inputName(input, state) {
        const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
        // TODO: Remember current value when navigating back.
        state.name = await input.showInputBox({
            title,
            step: 2 + additionalSteps,
            totalSteps: 3 + additionalSteps,
            value: state.name || '',
            prompt: 'Choose a unique name for the Application Service',
            validate: validateNameIsUnique,
            shouldResume: shouldResume,
        });
        return (input) => pickRuntime(input, state);
    }
    async function pickRuntime(input, state) {
        const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
        const runtimes = await getAvailableRuntimes(state.resourceGroup, undefined /* TODO: token */);
        // TODO: Remember currently active item when navigating back.
        state.runtime = await input.showQuickPick({
            title,
            step: 3 + additionalSteps,
            totalSteps: 3 + additionalSteps,
            placeholder: 'Pick a runtime',
            items: runtimes,
            activeItem: state.runtime,
            shouldResume: shouldResume,
        });
    }
    function shouldResume() {
        // Could show a notification with the option to resume.
        return new Promise((resolve, reject) => {
            // noop
        });
    }
    async function validateNameIsUnique(name) {
        // ...validate...
        await new Promise(resolve => setTimeout(resolve, 1000));
        return name === 'vscode' ? 'Name not unique' : undefined;
    }
    async function getAvailableRuntimes(resourceGroup, token) {
        // ...retrieve...
        await new Promise(resolve => setTimeout(resolve, 1000));
        return ['Node 8.9', 'Node 6.11', 'Node 4.5'].map(label => ({ label }));
    }
    const state = await collectInputs();
    vscode_1.window.showInformationMessage(`Creating Application Service '${state.name}'`);
}
exports.multiStepInput = multiStepInput;
// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------
class InputFlowAction {
}
InputFlowAction.back = new InputFlowAction();
InputFlowAction.cancel = new InputFlowAction();
InputFlowAction.resume = new InputFlowAction();
class MultiStepInput {
    constructor() {
        this.steps = [];
    }
    static async run(start) {
        const input = new MultiStepInput();
        return input.stepThrough(start);
    }
    async stepThrough(start) {
        let step = start;
        while (step) {
            this.steps.push(step);
            if (this.current) {
                this.current.enabled = false;
                this.current.busy = true;
            }
            try {
                step = await step(this);
            }
            catch (err) {
                if (err === InputFlowAction.back) {
                    this.steps.pop();
                    step = this.steps.pop();
                }
                else if (err === InputFlowAction.resume) {
                    step = this.steps.pop();
                }
                else if (err === InputFlowAction.cancel) {
                    step = undefined;
                }
                else {
                    throw err;
                }
            }
        }
        if (this.current) {
            this.current.dispose();
        }
    }
    async showQuickPick({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume, }) {
        const disposables = [];
        try {
            return await new Promise((resolve, reject) => {
                const input = vscode_1.window.createQuickPick();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.placeholder = placeholder;
                input.items = items;
                if (activeItem) {
                    input.activeItems = [activeItem];
                }
                input.buttons = [
                    ...(this.steps.length > 1 ? [vscode_1.QuickInputButtons.Back] : []),
                    ...(buttons || []),
                ];
                disposables.push(input.onDidTriggerButton(item => {
                    if (item === vscode_1.QuickInputButtons.Back) {
                        reject(InputFlowAction.back);
                    }
                    else {
                        resolve(item);
                    }
                }), input.onDidChangeSelection(items => resolve(items[0])), input.onDidHide(() => {
                    (async () => {
                        reject(shouldResume && (await shouldResume())
                            ? InputFlowAction.resume
                            : InputFlowAction.cancel);
                    })().catch(reject);
                }));
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        }
        finally {
            disposables.forEach(d => d.dispose());
        }
    }
    async showInputBox({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume, }) {
        const disposables = [];
        try {
            return await new Promise((resolve, reject) => {
                const input = vscode_1.window.createInputBox();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.value = value || '';
                input.prompt = prompt;
                input.buttons = [
                    ...(this.steps.length > 1 ? [vscode_1.QuickInputButtons.Back] : []),
                    ...(buttons || []),
                ];
                let validating = validate('');
                disposables.push(input.onDidTriggerButton(item => {
                    if (item === vscode_1.QuickInputButtons.Back) {
                        reject(InputFlowAction.back);
                    }
                    else {
                        resolve(item);
                    }
                }), input.onDidAccept(async () => {
                    const value = input.value;
                    input.enabled = false;
                    input.busy = true;
                    if (!(await validate(value))) {
                        resolve(value);
                    }
                    input.enabled = true;
                    input.busy = false;
                }), input.onDidChangeValue(async (text) => {
                    const current = validate(text);
                    validating = current;
                    const validationMessage = await current;
                    if (current === validating) {
                        input.validationMessage = validationMessage;
                    }
                }), input.onDidHide(() => {
                    (async () => {
                        reject(shouldResume && (await shouldResume())
                            ? InputFlowAction.resume
                            : InputFlowAction.cancel);
                    })().catch(reject);
                }));
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        }
        finally {
            disposables.forEach(d => d.dispose());
        }
    }
}
//# sourceMappingURL=QuickPick.js.map