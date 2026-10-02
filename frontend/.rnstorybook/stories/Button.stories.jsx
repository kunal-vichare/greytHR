//step 1: Import the actual component
import Button from '../../src/components/Button';

//step 2: Create storybook metadata
const meta = {
    title: 'Components/Button',
    component: Button,
    argTypes: {
        type: {
            control: {
                type: 'select',
            },
            options: ['primary', 'secondary', 'outline', 'danger'],
        },

        disabled: {
            control: {
                type: 'boolean',
            },
        },

        loading: {
            control: {
                type: 'boolean',
            },
        },

        title: {
            control: {
                type: 'text',
            },
        },
    },
};

export default meta;

//step 3: create story
// Primary button
export const Primary = {
    args: {
        title: 'Login',
        type: 'primary',
        disabled: false,
        loading: false,
    },
};

// Secondary button
export const Secondary = {
    args: {
        title: 'Continue',
        type: 'secondary',
        disabled: false,
        loading: false,
    },
};

// Outline button
export const Outline = {
    args: {
        title: 'Cancel',
        type: 'outline',
        disabled: false,
        loading: false,
    },
};

// Danger button
export const Danger = {
    args: {
        title: 'Delete',
        type: 'danger',
        disabled: false,
        loading: false,
    },
};

// Disabled button
export const Disabled = {
    args: {
        title: 'Login',
        type: 'primary',
        disabled: true,
        loading: false,
    },
};

// Loading button
export const Loading = {
    args: {
        title: 'Login',
        type: 'primary',
        disabled: false,
        loading: true,
    },
};

// Long text
export const LongText = {
    args: {
        title: 'Continue to Complete Your Registration',
        type: 'primary',
        disabled: false,
        loading: false,
    },
};