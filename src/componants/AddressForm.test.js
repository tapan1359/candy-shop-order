import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressForm from './AddressForm'; // Replace with the correct path to your component

// Mock data for addresses
const addresses = [
  { first_name: 'John', last_name: 'Doe', address1: '123 Main St', city: 'Anytown', state_or_province: 'State', postal_code: '12345', country: 'Country', phone: '123-456-7890', giftMessage: 'Happy Birthday' },
  // ... other address entries
];

describe('AddressForm', () => {

  const openModal = () => {
    fireEvent.click(screen.getByText('Update'));
  }

  test('renders AddressForm with title', () => {
    render(<AddressForm title="Test Address Form" addresses={addresses} address={addresses[0]} setAddress={() => {}} />);
    expect(screen.getByText('Test Address Form')).toBeInTheDocument();
  });

  test('populates the autocomplete with addresses', () => {
    render(<AddressForm title="Test Address Form" addresses={addresses} address={addresses[0]} setAddress={() => {}} />);
    userEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText(`${addresses[0].first_name}, ${addresses[0].last_name}`)).toBeInTheDocument();
  });

  test('calls setAddress with the selected address', () => {
    const mockSetAddress = jest.fn();
    render(<AddressForm title="Test Address Form" addresses={addresses} address={addresses[0]} setAddress={mockSetAddress} />);
    userEvent.click(screen.getByRole('textbox'));
    userEvent.click(screen.getByText(`${addresses[0].first_name}, ${addresses[0].last_name}`));
    expect(mockSetAddress).toHaveBeenCalledWith(addresses[0]);
  });

  test('updates field values and calls setAddress when inputs are changed', () => {
    const mockSetAddress = jest.fn();
    render(<AddressForm title="Test Address Form" addresses={addresses} address={addresses[0]} setAddress={mockSetAddress} />);
    fireEvent.click(screen.getByText('Update'));
    const firstNameInput = screen.getByLabelText('First name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    expect(mockSetAddress).toHaveBeenCalledWith(expect.objectContaining({ first_name: 'Jane' }));
  });

  test('displays modal with address details when update button is clicked', () => {
    render(<AddressForm title="Test Address Form" addresses={addresses} address={addresses[0]} setAddress={() => {}} />);
    fireEvent.click(screen.getByText('Update'));
    expect(screen.getByLabelText('First name').value).toBe(addresses[0].first_name);
    expect(screen.getByLabelText('Last name').value).toBe(addresses[0].last_name);
  });

  // Add more tests as needed to cover other interactions and scenarios
});
