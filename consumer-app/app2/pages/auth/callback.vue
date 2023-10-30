<template>
<div>Loading....</div>
</template>

<script setup>
import { onMounted } from 'vue'
import useAuth from "~/composables/useAuth";

const {authenticated, exchangeCodeToken, validateCallbackParams} = useAuth()

onMounted(() => {
    const {query} = useRoute();
    try {
        validateCallbackParams(query)
    } catch (e) {
        console.error(e)
        return;
    }

    const code = query?.code;
    exchangeCodeToken(code);
})
</script>
