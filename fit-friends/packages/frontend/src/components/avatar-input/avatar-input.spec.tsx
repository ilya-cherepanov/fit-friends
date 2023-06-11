import {cleanup, render, screen} from '@testing-library/react';
import {AvatarInput} from './avatar-input';
import userEvent from '@testing-library/user-event';
import {MockedFunction} from 'vitest';
import '@testing-library/jest-dom';


describe('AvatarInput', () => {
  const name = 'avatar';
  let avatarInput: ReturnType<typeof render>;
  let onChange: ReturnType<typeof vi.fn>;
  let onBlur: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChange = vi.fn();
    onBlur = vi.fn();
    avatarInput = render(<AvatarInput name={name} onChange={onChange} onBlur={onBlur}/>);
  });

  afterEach(cleanup);

  it('should render successful', () => {
    expect(avatarInput.baseElement).toBeTruthy();
  });

  // it('should emit onChange', async () => {
  //   const file = new File(['hello'], 'avatar.jpg', {type: 'image/jpg'});
  //   const user = userEvent.setup();
  //
  //   const input = avatarInput.container.querySelector<HTMLInputElement>('input[type="file"]') as HTMLInputElement;
  //
  //   expect(input).toBeInTheDocument();
  //   expect(input.files?.length).toBe(0);
  //   await user.upload(input, file);
  //   expect(input.files?.length).toBe(1);
  //
  //   // expect(onChange).toBeCalledWith(file);
  // });
});
