<template>
    <div>
        <nav
            class="flex-no-wrap relative flex w-full items-center justify-between lg:flex-wrap lg:justify-start lg:py-4">
            <div class="flex w-full flex-wrap items-center justify-between px-3">
                <div></div>

                <!-- Right elements -->
                <div class="relative flex items-center">
                    <!-- Second dropdown container -->
                    <div
                        v-if="authenticated"
                        class="relative"
                        data-te-dropdown-ref
                        data-te-dropdown-alignment="end">
                        <!-- Second dropdown trigger -->
                        <a
                            class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                            href="#"
                            id="dropdownMenuButton2"
                            role="button"
                            data-te-dropdown-toggle-ref
                            aria-expanded="false">
                            <!-- User avatar -->
                            <img
                                src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg"
                                class="rounded-full"
                                style="height: 25px; width: 25px"
                                alt=""
                                loading="lazy"/>
                        </a>
                        <!-- Second dropdown menu -->
                        <ul
                            class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                            aria-labelledby="dropdownMenuButton2"
                            data-te-dropdown-menu-ref>
                            <!-- Second dropdown menu items -->
                            <li>
                                <a
                                    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                                    href="#"
                                    data-te-dropdown-item-ref
                                >Action</a
                                >
                            </li>
                            <li>
                                <a
                                    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                                    href="#"
                                    data-te-dropdown-item-ref
                                >Another action</a
                                >
                            </li>
                            <li>
                                <a
                                    class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                                    href="#"
                                    data-te-dropdown-item-ref
                                >Something else here</a
                                >
                            </li>
                        </ul>
                    </div>
                    <nuxt-link v-else to="/login">
                        Login
                    </nuxt-link>
                </div>
            </div>
        </nav>
        <div class="mainContent">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import useAuth from "~/composables/useAuth";
import "tw-elements/dist/css/tw-elements.min.css";

const {authenticated, me} = useAuth();
</script>
