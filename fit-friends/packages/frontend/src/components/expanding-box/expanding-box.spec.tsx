import {cleanup, render, screen} from '@testing-library/react';
import {ExpandingBox} from './expanding-box';
import '@testing-library/jest-dom';
import {MAX_COUNT_NOT_EXPANDED_CONTAINER} from '../../constants';
import userEvent from '@testing-library/user-event';


describe('ExpandingBox', () => {
  const elementsCount = 10;
  const elements = Array.from({length: elementsCount}, (value, key) => (
    <div key={key}>Element #{key}</div>
  ));

  afterEach(cleanup);

  it('should render successful', () => {
    const {baseElement} = render(<ExpandingBox classPrefix="Box" label="Box">{elements}</ExpandingBox>);
    expect(baseElement).toBeTruthy();
  });

  it(`should render only ${MAX_COUNT_NOT_EXPANDED_CONTAINER} elements`, () => {
    render(<ExpandingBox classPrefix="Box" label="Box">{elements}</ExpandingBox>);

    expect(screen.getByText(`Element #${MAX_COUNT_NOT_EXPANDED_CONTAINER - 1}`)).toBeInTheDocument();
    expect(screen.queryByText(`Element #${MAX_COUNT_NOT_EXPANDED_CONTAINER}`)).not.toBeInTheDocument();
  });

  it('should render all elements', async () => {
    render(<ExpandingBox classPrefix="Box" label="Box">{elements}</ExpandingBox>);
    const user = userEvent.setup()

    await user.click(screen.getByText('Посмотреть все'));

    expect(screen.getByText(`Element #${MAX_COUNT_NOT_EXPANDED_CONTAINER - 1}`)).toBeInTheDocument();
    expect(screen.getByText(`Element #${MAX_COUNT_NOT_EXPANDED_CONTAINER}`)).toBeInTheDocument();
    expect(screen.getByText(`Element #${elementsCount - 1}`)).toBeInTheDocument();
  });
});
