/**
 * @jest-environment jsdom
 */
const scriptTest = require('./script.js');

beforeEach(() => {
    document.body.innerHTML = `
        <main class="container">
            <form action="" name="form1" onsubmit="return registration_validation()">
                <h2>Register</h2>
                <p id="result"></p>
                <label class="input-box">
                    <ion-icon name="person"></ion-icon>
                    <input type="text" name="Username" placeholder="Username" required>
                </label>
                <label class="input-box">
                    <ion-icon name="mail"></ion-icon>
                    <input type="email" name="Email" placeholder="Email" required>
                </label>
                <label class="input-box">
                    <ion-icon name="lock-closed"></ion-icon>
                    <input type="password" name="Password" placeholder="Password" required>
                </label>
                <label class="input-box">
                    <ion-icon name="lock-closed"></ion-icon>
                    <input type="password" name="cPassword" placeholder="Confirm Password" required>
                </label>
                <input type="submit" class="btn" value="Register">
                <nav class="group">
                    <a href="index.html" >Already have an Account?</a>
                    <a><button id="google-login-btn" class="google-button">
                        <i class="text1">SignIn with Google</i>
                    </button></a>
                </nav>
            </form>
            
            <section class="popup" id="popup">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <h2>Thank you!</h2>
                <p>You have compelted your registration!</p>
                <a href="index.html"><button onclick="closeSlide()">OK</button></a>
            </section>
        </main>
    `;
});

test('returns true for valid input', () => {
    const username = 'user1';
    const email = 'test@example.com';
    const password = '13245678';
    const confirmPassword = '13245678';
    expect(scriptTest.registration_validation(username, email, password, confirmPassword)).toBe(true);
    // expect(registration_validation(form1)).toBe(true);
});

test('returns false and sets error message for username less than 3 characters', () => {
    const username = 'u1';
    const email = 'test@example.com';
    const password = '13245678';
    const confirmPassword = '13245678';
    expect(scriptTest.registration_validation(username, email, password, confirmPassword)).toBe(false);
    expect(document.getElementById('result').innerHTML).toBe('Username should be at least 3 characters');
});

test('returns false and sets error message for invalid email format', () => {
    const username = 'user1';
    const email = 'invalid_email';
    const password = '13245678';
    const confirmPassword = '13245678';
    expect(scriptTest.registration_validation(username, email, password, confirmPassword)).toBe(false);
    expect(document.getElementById('result').innerHTML).toBe('Email is invalid!');
});

test('returns false and sets error message for password less than 8 characters', () => {
    const username = 'user1';
    const email = 'test@example.com';
    const password = '1324567';
    const confirmPassword = '13245678';
    expect(scriptTest.registration_validation(username, email, password, confirmPassword)).toBe(false);
    expect(document.getElementById('result').innerHTML).toBe('Password needs to be at least 8 characters');
});

test('returns false and sets error message for passwords not matching', () => {
    const username = 'user1';
    const email = 'test@example.com';
    const password = '13245678';
    const confirmPassword = '1324567';
    expect(scriptTest.registration_validation(username, email, password, confirmPassword)).toBe(false);
    expect(document.getElementById('result').innerHTML).toBe('Password does not match');
});


global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ value: 'mocked response' }),
    })
);

describe('create function', () => {
    it('should call fetch with the correct endpoint and data', async () => {
      const userN = 'testUser';
      const pWord = 'testPassword';
      const isA = false;
      const em = 'test@example.com';
  
      await scriptTest.create(userN, pWord, isA, em);
  
      expect(fetch).toHaveBeenCalledWith('/data-api/rest/User/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userN,
          password: pWord,
          is_admin: isA,
          email: em,
        }),
      });
    });
  
    it('should return the response value', async () => {
      const userN = 'testUser';
      const pWord = 'testPassword';
      const isA = false;
      const em = 'test@example.com';
  
      const result = await scriptTest.create(userN, pWord, isA, em);
  
      expect(result).toEqual({"value": "mocked response"});
    });
  });
