<template>
  <div
    class="pr-3 lg:p-4 2xl:p-8 bg-white xl:border border-brand-gray rounded-[16px] space-y-10"
  >
    <h3 class="text-lg 2xl:text-xl font-semibold text-brand-gray-500">
      {{ plan.description }}
    </h3>
    <ul class="flex flex-col gap-4">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
        class="flex justify-between items-center gap-4 text-base text-black font-semibold"
      >
        <span>{{ feature }}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9" cy="9" r="9" fill="#FEB80A" />
          <path
            d="M6.81009 12.8306C6.91095 12.9387 7.05177 13 7.19916 13C7.34655 13 7.48737 12.9387 7.58823 12.8306L13.8356 6.54637C13.9408 6.44139 14 6.29849 14 6.14942C14 6.00034 13.9408 5.85744 13.8356 5.75246L13.2464 5.15982C13.0303 4.94673 12.6844 4.94673 12.4683 5.15982L7.19916 10.46L5.53171 8.79392C5.43085 8.68582 5.29003 8.6245 5.14264 8.6245C4.99526 8.6245 4.85444 8.68582 4.75357 8.79392L4.16441 9.38656C4.05919 9.49154 4 9.63444 4 9.78352C4 9.93259 4.05919 10.0755 4.16441 10.1805L6.81009 12.8306Z"
            fill="white"
          />
        </svg>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DataMenus",
  props: ["plan"],
};
</script>

<style></style>
