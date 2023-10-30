<template>
    <h1 class="text-center mx-6">Hello Home Page</h1>
    <p class="text-center">Name: {{ me.name }}</p>
    <p class="text-center">Email: {{ me.email }}</p>
</template>
<script lang="ts" setup>

import {useMe} from "~/composables/useAuth";
const me = useMe()

definePageMeta({
    middleware: 'auth' // this should match the name of the file inside the middleware directory
})
</script>
