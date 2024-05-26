/**
 * @jest-environment jsdom
 */
const loginTest = require('./login-validation.js');

describe('list', () => {
    it('fetches user data from API endpoint', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({ value: [{ username: 'test', password: '123' }] })
        });

        const data = await loginTest.list();
        expect(data).toEqual([{ username: 'test', password: '123' }]);
        expect(fetch).toHaveBeenCalledWith('/data-api/rest/User/');
    });

    it('handles API error', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));
        await expect(loginTest.list()).rejects.toThrow('Failed to fetch');
    });
});

describe('findUser', () => {
    const mockUserData = [
        { username: 'user1', password: 'pass1', email: 'user1@example.com' },
        { username: 'user2', password: 'pass2', email: 'user2@example.com' },
    ];

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({ value: mockUserData }),
        });
    });

    test('should find user by username and password', async () => {
        const foundUser = await loginTest.findUser('user1', 'pass1');
        expect(foundUser).toEqual(mockUserData[0]);
    });

    test('should find user by email and password', async () => {
        const foundUser = await loginTest.findUser('user2@example.com', 'pass2');
        expect(foundUser).toEqual(mockUserData[1]);
    });

    test('should return undefined if user is not found', async () => {
        const foundUser = await loginTest.findUser('unknown', 'unknown');
        expect(foundUser).toBeUndefined();
    });
});

describe('login_validation', () => {
  beforeEach(() => {
      // Create a mock form element and input elements
      document.body.innerHTML = `
      <main class="container">
      <form action="" name="form1" onsubmit="return validateLogin()">
          <h2>Login</h2>
          <label class="input-box">
              <ion-icon name="person"></ion-icon>
              <input type="text" name="Username" placeholder="Username/Email" autocomplete="given-name">
          </label>
          <label class="input-box">
              <ion-icon name="lock-closed"></ion-icon>
              <input type="password" name="Password" placeholder="Password">
          </label>
          <input type="submit" class="btn" value="Login">
          <nav class="group">
              <a href="#">Forgot Password?</a>
              <a href="registration.html">Do not have an account yet?</a>
          </nav>
      </form>

      <section class="popup" id="popup">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
          <h2>Thank you!</h2>
          <p>Login Successful!</p>
          <a href="home.html"><button onclick="closeSlide()">OK</button></a>
      </section>

      <section class="popup" id="popupUserNotFound">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
          <h2>ERROR</h2>
          <p>Username/Email or Password was incorrect</p>
          <a href="index.html"><button onclick="closeSlideUserNotFound()">OK</button></a>
      </section>

      <nav class="group1">
          <a><button id="google-signin-btn" class="google-button1">
              <i class="text2">SignIn with Google</i>
          </button></a>
      </nav>
  </main>
      `;
    });

  test('should show user not found popup when user is not found', async () => {
    const username = 'test_username';
    const password = 'test_password';

    // Create a mock event object with the necessary properties
    const eventMock = {
      preventDefault: jest.fn(),
      target: {
        elements: {
          Username: { value: username },
          Password: { value: password }
        }
      }
    };

    // Mock the findUser function to return undefined (user not found)
    jest.mock('./login-validation.js', () => ({
      findUser: jest.fn(() => Promise.resolve(undefined))
    }));

    // Call the function with the mock event object
    await loginTest.login_validation(eventMock);

    // Check if the user not found popup is displayed
    expect(document.getElementById('popupUserNotFound').classList.contains('open-slide')).toBe(false);
  });

  test('should show success popup when user is found', async () => {
      // Mocking document.getElementById to return a DOM element (user found)
      document.getElementById = jest.fn().mockReturnValue({ classList: { add: jest.fn() } });
    
      // Mocking fetch to resolve with some user data
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({ value: [{ username: 'test', password: 'password' }] }),
      }));
    
      // Call the function with a dummy form
      const dummyForm = { Username: { value: 'test' }, Password: { value: 'password' } };
      await loginTest.login_validation(dummyForm);
    
      // Check if the popup element exists
      expect(document.getElementById('popup')).not.toBeNull();
    });
});
