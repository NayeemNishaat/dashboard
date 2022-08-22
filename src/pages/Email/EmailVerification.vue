<template>
  <div class="page-container">
    <header>
      <h1>
        <img
          class="logo"
          src="@/assets/img/datacue-logo-dark.svg"
          alt="DataCue"
        />
      </h1>
      <img
        class="supergirl"
        src="@/assets/img/sign-up/supergirl-layout-4-5.svg"
        alt=""
      />
    </header>
    <div class="message">
      <h2>{{ $t(verified ? "congratulations" : "something went wrong") }}</h2>
      <p v-if="verified">
        {{ $t("your email is verified") }}
      </p>
      <p v-else>
        {{ $t("could not verify email") }}
      </p>
      <router-link class="button" v-if="verified" :to="{ name: 'login' }">
        {{ $t("login") }}
      </router-link>
      <a class="button" v-else href="https://www.datacue.co/contact">
        {{ $t("contact us") }}
      </a>
      <footer>© {{ new Date().getFullYear() }} DataCue</footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmailVerification",
  props: {
    verified: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;

  @media (min-width: 992px) {
    flex-flow: row nowrap;
    overflow-y: hidden;
    background: url("@/assets/img/sign-up/yellow-background-layout-5.svg")
      no-repeat center center / cover;
  }
}

header {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 53vw;
  max-height: 200px;
  text-align: center;
  background: url("@/assets/img/sign-up/yellow-background-layout-1-2-3.svg")
    no-repeat center center / cover;

  @media (min-width: 576px) {
    height: 34vw;
    max-height: 220px;
  }

  @media (min-width: 992px) {
    justify-content: flex-start;
    width: 50%;
    height: auto;
    max-height: none;
    background: none;
  }

  h1 {
    margin: 0;

    @media (min-width: 992px) {
      margin: 15vh 0 30px;
    }
  }

  .logo {
    height: 15.5vw;
    max-height: 70px;

    @media (min-width: 576px) {
      height: 12vw;
      max-height: 80px;
    }

    @media (min-width: 992px) {
      width: 28vw;
      height: auto;
      max-height: none;
    }
  }

  .supergirl {
    position: absolute;
    bottom: 70px;
    left: 0;
    right: 0;
    width: 70vw;
    max-width: 300px;
    margin: 0 auto;

    @media (min-width: 992px) {
      position: static;
      width: 28vw;
      max-width: none;
      margin-bottom: 30px;
    }
  }
}

.message {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  flex: 1 1 auto;
  padding: 30px 30px 400px;
  text-align: center;

  @media (min-width: 992px) {
    padding-bottom: 30px;
  }
}

.button {
  display: inline-block;
  height: 50px;
  margin: 30px auto;
  border: 0 none;
  border-radius: 25px;
  padding: 15px 50px;
  line-height: 20px;
  font-size: 16px;
  color: white;
  background-color: #fdb809;
}

footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  font-size: 14px;
  color: #bdc1c6;

  @media (min-width: 992px) {
    left: 50%;
  }
}
</style>
