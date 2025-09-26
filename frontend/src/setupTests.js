// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
/* import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LabelPreview from './labelPreview/LabelPreview.js';

test('Creating 100 labels in JSON mode', async () => {
    for (let i = 1; i <= 100; i++) {
        let label = {
            name: 'label #' + i,
            size: 0,
            ingredients: '',
            mark: '',
            expiration: '',
            options: [true, true, true],
        };

        render(<LabelPreview label={label} border={false} allowNavigate={false}/>);

        const button = screen.getByRole('button', {name: /printOnClick/i});

        await userEvent.click(button);

        expect(screen.getByText('label #' + i)).toBeInTheDocument();
    }
})*/