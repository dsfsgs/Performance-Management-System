<template>
  <div class="login-page">
    <div class="overlay">
      <q-card class="login-card">
        <q-img
          src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png"
          class="logo"
          spinner-color="white"
          spinner-size="40px"
        />
        <h2 class="title">Performance Management System</h2>
        <p class="subtitle">Login</p>
        <q-form class="login-form" @submit.prevent="login">
          <!-- Username Input -->
          <div class="input-container">
            <q-input
              v-model="username"
              label="Username"
              filled
              class="input"
              color="green-8"
              @blur="validateUsername"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-slide-transition>
              <div v-if="usernameError" class="validation">
                {{ usernameError }}
              </div>
            </q-slide-transition>
          </div>

          <!-- Password Input -->
          <div class="input-container">
            <q-input
              v-model="password"
              label="Password"
              filled
              :type="isPwd ? 'password' : 'text'"
              class="input"
              color="green-8"
              @blur="validatePassword"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-slide-transition>
              <div v-if="passwordError" class="validation">
                {{ passwordError }}
              </div>
            </q-slide-transition>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="row items-center justify-between q-mb-md">
            <q-checkbox
              v-model="rememberMe"
              label="Remember me"
              color="green-8"
              class="text-white custom-checkbox"
            />
          </div>

          <!-- Login Button -->
          <q-btn
            type="submit"
            label="Sign in"
            class="login-button"
            :loading="isLoading"
            :disable="isLoading"
          />
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useQuasar,
  QImg,
  QIcon,
  QInput,
  QSlideTransition,
  QCheckbox,
  QBtn,
  QForm,
  QCard,
} from 'quasar'
import { useUserStore } from '../../stores/userStore'

export default {
  name: 'LoginPage',
  components: {
    QImg,
    QIcon,
    QInput,
    QSlideTransition,
    QCheckbox,
    QBtn,
    QForm,
    QCard,
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const $q = useQuasar()
    const imageLoaded = ref(false)

    const username = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const usernameError = ref('')
    const passwordError = ref('')
    const rememberMe = ref(false)
    const isLoading = ref(false)

    const onImageLoad = () => {
      imageLoaded.value = true
    }

    // Validation functions
    const validateUsername = () => {
      if (!username.value) {
        usernameError.value = 'Username is required'
      } else if (username.value.length < 2) {
        usernameError.value = 'Username must be at least 2 characters'
      } else {
        usernameError.value = ''
      }
    }

    const validatePassword = () => {
      if (!password.value) {
        passwordError.value = 'Password is required'
      } else if (password.value.length < 2) {
        passwordError.value = 'Password must be at least 2 characters'
      } else {
        passwordError.value = ''
      }
    }

    // Login function with validation check
    const login = async () => {
      validateUsername()
      validatePassword()

      if (!usernameError.value && !passwordError.value) {
        isLoading.value = true
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Handle login based on username
          if (username.value === 'hr') {
            userStore.setUser({ role: 'hr-admin' })
            if (rememberMe.value) {
              localStorage.setItem(
                'rememberedUser',
                JSON.stringify({ username: username.value, role: 'hr-admin' }),
              )
            }
            router.push('/hr/dashboard')
          } else if (username.value === 'office') {
            userStore.setUser({ role: 'office-admin' })
            if (rememberMe.value) {
              localStorage.setItem(
                'rememberedUser',
                JSON.stringify({ username: username.value, role: 'office-admin' }),
              )
            }
            router.push('/office/dashboard')
          } else if (username.value === 'planning') {
            userStore.setUser({ role: 'planning-admin' })
            if (rememberMe.value) {
              localStorage.setItem(
                'rememberedUser',
                JSON.stringify({ username: username.value, role: 'planning-admin' }),
              )
            }
            router.push('/planning/dashboard')
          } else {
            $q.notify({
              color: 'negative',
              message: 'Invalid credentials',
              position: 'top',
            })
          }
        } catch {
          $q.notify({
            color: 'negative',
            message: 'An error occurred during login',
            position: 'top',
          })
        } finally {
          isLoading.value = false
        }
      } else {
        console.log('Form validation failed')
      }
    }

    // Check for remembered user on component mount
    const checkRememberedUser = () => {
      const rememberedUser = localStorage.getItem('rememberedUser')
      if (rememberedUser) {
        const { username: rememberedUsername, role } = JSON.parse(rememberedUser)
        username.value = rememberedUsername
        rememberMe.value = true
        userStore.setUser({ role })
      }
    }

    // Call checkRememberedUser when component mounts
    checkRememberedUser()

    return {
      username,
      password,
      isPwd,
      usernameError,
      passwordError,
      rememberMe,
      isLoading,
      imageLoaded,
      validateUsername,
      validatePassword,
      login,
      onImageLoad,
    }
  },
}
</script>

<style scoped>
/* Full-page layout */
.login-page {
  background: url('../../assets/image.png') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  padding: 20px;
}

/* Dark overlay */
.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Centered card container */
.overlay {
  background: rgba(32, 85, 64, 0.85);
  padding: 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
  position: relative;
  z-index: 2;
  margin: auto;
}

/* Card content */
.login-card {
  padding: 15px;
  background: transparent;
  box-shadow: none;
  text-align: center;
  width: 100%;
}

/* Logo */
.logo {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
}

/* Titles */
.title {
  font-size: 24px;
  color: white;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 5px;
  text-align: center;
}

.subtitle {
  font-size: 18px;
  color: white;
  margin: 15px 0;
  text-align: left;
  padding-left: 8px;
}

/* Form */
.login-form {
  margin-top: 10px;
  width: 100%;
}

/* Inputs */
.input-container {
  margin-bottom: 20px;
}

.input {
  background: white;
  border-radius: 8px;
}

.input :deep(.q-field--focused) {
  .q-field__label {
    color: #00903e !important;
  }
  .q-field__control {
    color: #00903e !important;
  }
  .q-field__control:before {
    border-color: #00903e !important;
  }
}

.input :deep(.q-field--highlighted) {
  .q-field__label {
    color: #00903e !important;
  }
  .q-field__control {
    color: #00903e !important;
  }
  .q-field__control:before {
    border-color: #00903e !important;
  }
}

.input :deep(.q-field__control) {
  height: 48px;
}

.input :deep(.q-field__marginal) {
  height: 48px;
}

/* Validation message */
.validation {
  color: #ff5252;
  font-size: 12px;
  margin-top: 4px;
  text-align: left;
}

/* Login button */
.login-button {
  background-color: #00903e;
  color: white;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
}

.login-button:hover {
  background-color: #007a34;
}

/* Remember me checkbox */
.custom-checkbox.q-checkbox {
  color: white;
}

.custom-checkbox :deep(.q-checkbox__inner) {
  color: white;
}

.custom-checkbox :deep(.q-checkbox__inner--truthy) {
  color: #00903e !important;
}

.custom-checkbox :deep(.q-checkbox__inner:before) {
  border-color: white;
}

.custom-checkbox :deep(.q-checkbox__bg) {
  border-color: white;
}

.custom-checkbox :deep(.q-checkbox__svg) {
  color: white !important;
}

/* Loading state for button */
.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 599px) {
  .overlay {
    width: 95%;
    padding: 20px;
  }

  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 16px;
  }
}
</style>
