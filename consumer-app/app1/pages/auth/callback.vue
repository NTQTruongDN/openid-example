<template>
<div>Loading....</div>
</template>

<script setup>
import { onMounted } from 'vue'
import useAuth from "~/composables/useAuth";

const {authenticated, exchangeCodeToken} = useAuth()

onMounted(() => {
    const {query} = useRoute();

    const code = query?.code;
    if (!code) {
        alert('Missing Code Params!')
    }

    exchangeCodeToken(code);
})
</script>
