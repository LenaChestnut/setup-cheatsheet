import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Initial test', () => {
	render(<App />);
	expect(screen.getByText('Hello')).toBeInTheDocument();
});
