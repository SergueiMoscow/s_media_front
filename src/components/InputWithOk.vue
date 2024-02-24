<template>
  <div class="editable-field" :class="{ editing: isEditing }">
    <input
      :value="noteValue"
      @input="updateValue"
      :placeholder="placeholder"
      @focus="editMode"
    />
    <v-icon v-if="showButtons" @click="saveChanges" class="px-1 success--text">
      mdi-check-circle
    </v-icon>
    <v-icon v-if="showButtons" @click="cancelChanges" class="px-1 error--text">
      mdi-close-circle
    </v-icon>
  </div>
</template>

<script>
export default {
  name: "EditableComponent",
  props: {
    modelValue: String,
    placeholder: String,
  },
  data() {
    return {
      isEditing: false,
      showButtons: false,
      pendingValue: "",
      noteValue: this.modelValue,
    };
  },
  created() {
    this.pendingValue = this.modelValue;
    this.noteValue - this.modelValue
  },
  methods: {
    editMode() {
      this.pendingValue = this.noteValue;
      this.isEditing = true;
      this.showButtons = true;
    },
    updateValue(event) {
      this.pendingValue = event.target.value;
    },
    saveChanges() {
      if (this.pendingValue !== this.noteValue) {
        this.$emit("update:modelValue", this.pendingValue);
      }
      this.isEditing = false;
      this.showButtons = false;
      this.noteValue = this.pendingValue;
    },
    cancelChanges() {
      this.isEditing = false;
      this.showButtons = false;
    },
  },
};
</script>

<style scoped>
.editable-field {
  display: flex;
  align-items: center;
}
.editable-field.editing {
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
