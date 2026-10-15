(function() {
    // Password toggle
    const pwdInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-pwd');

    if (toggleBtn && pwdInput) {
      const pwdIcon = toggleBtn.querySelector('.visibility-icon');
      toggleBtn.addEventListener('click', function() {
        const isPassword = pwdInput.type === 'password';
        pwdInput.type = isPassword ? 'text' : 'password';
        if(pwdIcon) {
          pwdIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
        }
      });
    }

    // Auth Switcher tabs
    const tabSignIn = document.getElementById('tab-signin');
    const tabSignUp = document.getElementById('tab-signup');
    const heading = document.getElementById('form-heading');
    const subheading = document.getElementById('form-subheading');
    const linkCreate = document.getElementById('link-create-account');

    function switchToSignUp() {
      window.location.href = 'register.html';
    }

    function switchToSignIn() {
      tabSignIn.className = 'auth-tab active';
      tabSignUp.className = 'auth-tab inactive';
      heading.textContent = 'Welcome back';
      subheading.textContent = 'Enter your credentials to access your botanical care dashboard & sensor logs.';
    }

    if (tabSignIn && tabSignUp) {
      tabSignUp.addEventListener('click', switchToSignUp);
      tabSignIn.addEventListener('click', switchToSignIn);
    }

    if (linkCreate) {
      linkCreate.addEventListener('click', function(e) {
        e.preventDefault();
        switchToSignUp();
      });
    }

    // Role Switcher
    const roleIndividual = document.getElementById('role-individual');
    const roleBusiness = document.getElementById('role-business');
    
    if (roleIndividual && roleBusiness) {
      const emailField = document.getElementById('email');
      const pwdField = document.getElementById('password');

      roleIndividual.addEventListener('click', function() {
        roleIndividual.className = 'role-btn active';
        roleIndividual.querySelector('.role-icon').className = 'role-icon active';
        
        roleBusiness.className = 'role-btn inactive';
        roleBusiness.querySelector('.role-icon').className = 'role-icon inactive';

        heading.textContent = 'Welcome back';
        subheading.textContent = 'Enter your credentials to access your botanical care dashboard & sensor logs.';
        if (emailField && emailField.value === 'trader@agrismart.com') {
          emailField.value = 'demo@agrismart.com';
          if (pwdField) pwdField.value = 'Demo123!';
        }
      });
      
      roleBusiness.addEventListener('click', function() {
        roleBusiness.className = 'role-btn active';
        roleBusiness.querySelector('.role-icon').className = 'role-icon active';
        
        roleIndividual.className = 'role-btn inactive';
        roleIndividual.querySelector('.role-icon').className = 'role-icon inactive';

        heading.textContent = 'Merchant & Nursery Portal';
        subheading.textContent = 'Sign in to access your nursery store, live customer orders, and wholesale inventory.';
        if (emailField && (!emailField.value || emailField.value === 'demo@agrismart.com')) {
          emailField.value = 'trader@agrismart.com';
          if (pwdField) pwdField.value = 'Trader123!';
        }
      });
    }
      // Theme Switcher for Login
    const loginThemeToggle = document.getElementById('loginThemeToggle');
    const loginThemeIcon = document.getElementById('loginThemeIcon');
    if (loginThemeToggle && loginThemeIcon) {
      loginThemeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          loginThemeIcon.textContent = 'light_mode';
          loginThemeIcon.className = 'material-symbols-outlined';
        } else {
          document.documentElement.classList.add('dark');
          loginThemeIcon.textContent = 'dark_mode';
          loginThemeIcon.className = 'material-symbols-outlined';
        }
      });
    }
  })();
