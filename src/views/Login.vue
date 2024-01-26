<template>
    <div class="center">
        <form class="login" @submit.prevent="login">
            <h1>Sign in</h1>
            <div>
                <label>Name</label>
                <input required v-model="username" type="text" placeholder="Name" />
            </div>
            <div>
                <label>Password</label>
                <input required v-model="password" type="password" placeholder="Password" />
            </div>
            <hr />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        login() {
            const data = {
                username: this.username,
                password: this.password
            };
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/token/`, data)
                .then(response => {
                    const { access, refresh } = response.data;
                    localStorage.setItem('access_token', access);
                    localStorage.setItem('refresh_token', refresh);
                    this.$emit('auth-changed');
                    this.$router.push('/');
                })
                .catch(err => {
                    console.error(err);
                    alert('Ошибка входа!');
                });
            }
    },
    name: 'LoginView'
}
</script>
  
<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.login {
    padding: 2em;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login h1 {
    text-align: center;
    margin-bottom: 1em;
}

.login div {
    margin-bottom: 1em;
}

label {
    display: block;
    margin-bottom: 0.5em;
}

input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 0.8em;
    background-color: #5c6bc0;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #3f51b5;
}

hr {
    margin: 1em 0;
}
</style>