/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react-native';
import SignUp from "../src/pages/Auth/SignUp";
import Login from "../src/pages/Auth/Login";
import FindScreen from "../src/pages/FindScreen";
import AddFilmModal from "../src/components/filmModals/AddFilmModal";
import AddFilmToListModal from "../src/components/filmModals/AddFilmToListModal";
import SearchUserScreen from "../src/pages/Users/SearchUserScreen";
import AddList from "../src/pages/Lists/AddList";
import UserFilmsScreen from "../src/pages/Users/UserFilmsScreen";

jest.mock('react-native/Libraries/Network/fetch', () => jest.fn());


test('F1.1', async () => {
  const mockNavigation = {
    goBack: jest.fn(),
    setOptions: jest.fn(),
  };

  const {getByTestId, getByText} = render(<SignUp navigation={mockNavigation}/>);

  // Fill in the form fields
  fireEvent.changeText(getByTestId('username-input'), 'JohnDoe');
  fireEvent.changeText(getByTestId('email-input'), 'johndoe@example.com');
  fireEvent.changeText(getByTestId('password-input'), 'password123');
  fireEvent.changeText(getByTestId('rePassword-input'), 'password123');

  // Submit the form
  fireEvent.press(getByText('registration'));

  // Verify that the loading state is true
  expect(getByTestId('loader')).toBeTruthy();

  // Simulate successful registration
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce({success: true}),
  });

  // Wait for the registration process to complete
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Verify that the user is redirected to the previous screen
  expect(mockNavigation.goBack).toHaveBeenCalled();
});
test('F2.1', () => {
  const {getByTestId, getByText} = render(<Login/>);

  // Встановлюємо значення email та password
  const emailInput = getByTestId('email-input');
  const passwordInput = getByTestId('password-input');
  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.changeText(passwordInput, 'test123');

  // Натискаємо кнопку відправки форми
  const submitButton = getByTestId('submit-button');
  fireEvent.press(submitButton);

  // Перевіряємо, що повідомлення про помилку порожнє
  const messageText = getByTestId('message-text');
  expect(messageText.props.children).toBe('');
})
test('F3.1.1', () => {
  const {getByTestId, getByText} = render(<Login/>);

  // Натискаємо кнопку відправки форми без заповнення полів
  const submitButton = getByTestId('submit-button');
  fireEvent.press(submitButton);

  // Перевіряємо, що отримали повідомлення про необхідність заповнити всі поля
  const messageText = getByTestId('message-text');
  expect(messageText.props.children).toBe('Fill in all fields');
})
test('F3.1.2', () => {
  const {getByTestId, getByText} = render(<Login/>);

  // Встановлюємо значення для поля email як невірної електронної пошти
  const emailInput = getByTestId('email-input');
  fireEvent.changeText(emailInput, 'invalid-email');

  // Натискаємо кнопку відправки форми
  const submitButton = getByTestId('submit-button');
  fireEvent.press(submitButton);

  // Перевіряємо, що отримали повідомлення про невірну електронну пошту
  const messageText = getByTestId('message-text');
  expect(messageText.props.children).toBe('Invalid email');
})
test('F3.1.3', () => {
  const {getByTestId, getByText} = render(<LoginScreen/>);

  // Встановлюємо значення для поля email
  const emailInput = getByTestId('email-input');
  fireEvent.changeText(emailInput, 'example@example.com');

  // Встановлюємо значення для поля password як невірного паролю
  const passwordInput = getByTestId('password-input');
  fireEvent.changeText(passwordInput, 'invalid-password');

  // Натискаємо кнопку відправки форми
  const submitButton = getByTestId('submit-button');
  fireEvent.press(submitButton);

  // Перевіряємо, що отримали повідомлення про невірний пароль
  const messageText = getByTestId('message-text');
  expect(messageText.props.children).toBe('Invalid password');
})
test('F4.1.1', async () => {
  const { getByTestId, getByText } = render(<FindScreen />);

  // Встановлюємо значення для поля пошуку фільмів за іменем
  const searchInput = getByTestId('search-input');
  fireEvent.changeText(searchInput, 'Harry Potter');

  // Натискаємо кнопку пошуку
  const searchButton = getByTestId('search-button');
  fireEvent.press(searchButton);

  // Очікуємо, що отримали результати пошуку
  await waitFor(() => {
    const movieTitle = getByText('Harry Potter and the Philosopher\'s Stone');
    expect(movieTitle).toBeDefined();
  });

  // Додайте інші перевірки, які вважаєте необхідними
});
test('F4.1.2', async () => {
  const { getByTestId, getByText } = render(<FindScreen />);

  // Встановлюємо значення для поля пошуку фільмів за жанром
  const genreInput = getByTestId('genre-input');
  fireEvent.changeText(genreInput, 'Action');

  // Натискаємо кнопку пошуку
  const searchButton = getByTestId('search-button');
  fireEvent.press(searchButton);

  // Очікуємо, що отримали результати пошуку
  await waitFor(() => {
    const movieTitle = getByText('Avengers: Endgame');
    expect(movieTitle).toBeDefined();
  });

  // Додайте інші перевірки, які вважаєте необхідними
});
test('F4.1.3', async () => {
  const { getByTestId, getByText } = render(<FindScreen />);

  // Встановлюємо значення для поля пошуку фільмів за роком випуску
  const releaseYearInput = getByTestId('release-year-input');
  fireEvent.changeText(releaseYearInput, '2021');

  // Натискаємо кнопку пошуку
  const searchButton = getByTestId('search-button');
  fireEvent.press(searchButton);

  // Очікуємо, що отримали результати пошуку
  await waitFor(() => {
    const movieTitle = getByText('Dune');
    expect(movieTitle).toBeDefined();
  });

  // Додайте інші перевірки, які вважаєте необхідними
});
test('F5.1.1', () => {
  const store = mockStore({
    auth: {
      authToken: 'your-auth-token',
      user: {
        favoriteFilms: []
      }
    }
  });

  const { getByTestId, getByText } = render(
    <Provider store={store}>
      <AddFilmModal />
    </Provider>
  );

  // Натисніть кнопку для додавання фільму до списку "Улюблені"
  const addToFavoritesButton = getByTestId('add-to-favorites-button');
  fireEvent.press(addToFavoritesButton);

  // Перевірка, що фільм було додано до списку "Улюблені"
  const successMessage = getByText('Movie added to favorites');
  expect(successMessage).toBeDefined();

  // Перевірка, що діялогове вікно було закрито
  const modal = getByTestId('add-film-modal');
  expect(modal).toBeNull();

  // Перевірка, що відправлено відповідну дію або діспетчеру
  const actions = store.getActions();
  expect(actions).toContainEqual({
    type: 'ADD_MOVIE_TO_FAVORITES',
    payload: {
      movieId: 'your-movie-id'
    }
  });
});
test('F5.1.2', () => {
  const store = mockStore({
    auth: {
      authToken: 'your-auth-token',
      user: {
        customLists: [
          {
            id: 'list-1',
            name: 'My List',
            films: []
          }
        ]
      }
    }
  });

  const { getByTestId, getByText } = render(
    <Provider store={store}>
      <AddFilmToListModal />
    </Provider>
  );

  // Натисніть кнопку для додавання фільму до створеного списку
  const addToCustomListButton = getByTestId('add-to-custom-list-button');
  fireEvent.press(addToCustomListButton);

  // Перевірка, що фільм було додано до створеного списку
  const successMessage = getByText('Movie added to My List');
  expect(successMessage).toBeDefined();

  // Перевірка, що діялогове вікно було закрито
  const modal = getByTestId('add-film-to-list-modal');
  expect(modal).toBeNull();

  // Перевірка, що відправлено відповідну дію або діспетчеру
  const actions = store.getActions();
  expect(actions).toContainEqual({
    type: 'ADD_MOVIE_TO_CUSTOM_LIST',
    payload: {
      movieId: 'your-movie-id',
      listId: 'list-1'
    }
  });
});
test('F6.1', () => {
  const store = mockStore({
    auth: {
      user: {
        subscriptions: []
      }
    }
  });

  const { getByTestId, getByText } = render(
    <Provider store={store}>
      <SearchUserScreen />
    </Provider>
  );

  // Натиснути кнопку підписки на користувача
  const subscribeButton = getByTestId('subscribe-button');
  fireEvent.press(subscribeButton);

  // Перевірка, що користувача було підписано
  const successMessage = getByText('User subscribed');
  expect(successMessage).toBeDefined();

  // Перевірка, що відправлено відповідну дію або діспетчеру
  const actions = store.getActions();
  expect(actions).toContainEqual({
    type: 'SET_USER',
    payload: {
      subscriptions: ['user-id']
    }
  });
});
test('F8.1', async () => {
  const store = mockStore({
    auth: {
      authToken: 'auth-token'
    }
  });

  const { getByPlaceholderText, getByText } = render(
    <Provider store={store}>
      <AddList />
    </Provider>
  );

  // Введення назви списку
  const nameInput = getByPlaceholderText('Enter Name');
  fireEvent.changeText(nameInput, 'My List');

  // Натиснення кнопки додавання фільму
  const addFilmButton = getByText('Add');
  fireEvent.press(addFilmButton);

  // Вибір фільму для списку (передаємо мокові дані фільму)
  const filmItem = getByText('Film Title');
  fireEvent.press(filmItem);

  // Натиснення кнопки збереження списку
  const saveButton = getByText('Save');
  fireEvent.press(saveButton);

  // Очікуємо, що списoк буде створений
  const successMessage = getByText('List created');
  expect(successMessage).toBeDefined();

  // Перевірка, що відправлено відповідну дію або діспетчеру
  const actions = store.getActions();
  expect(actions).toContainEqual({
    type: 'SET_USER_LIST',
    payload: {
      name: 'My List',
      films: [
        {
          id: 'film-id',
          title: 'Film Title'
        }
      ]
    }
  });
});
test('F10.1.1', () => {
  const { getByLabelText, getByText } = render(<UserFilmsScreen />);

  // Select the filter dropdown
  const filterDropdown = getByLabelText('Filter');
  fireEvent.change(filterDropdown, { target: { value: 'asc' } });

  // Select the rate dropdown
  const rateDropdown = getByLabelText('Rate');
  fireEvent.change(rateDropdown, { target: { value: 3 } });

  // Select the watched toggle button
  const watchedToggle = getByText('Watched');
  fireEvent.click(watchedToggle);

  // Verify that the films are filtered correctly
  // ... add your assertions here
});
test('F10.1.2', () => {
  const { getByLabelText, getByText } = render(<UserFilmsScreen />);

  // Select the rate dropdown
  const rateDropdown = getByLabelText('Rate');
  fireEvent.change(rateDropdown, { target: { value: 4 } });

  // Verify that the films are filtered correctly by rating
  // ... add your assertions here
});
test('F10.1.3', () => {
  const { getByLabelText, getByText } = render(<UserFilmsScreen />);

  // Select the alphabetical order dropdown
  const alphabeticalDropdown = getByLabelText('Alphabetical Order');
  fireEvent.change(alphabeticalDropdown, { target: { value: 'asc' } });

  // Verify that the films are filtered correctly alphabetically
  // ... add your assertions here
});
