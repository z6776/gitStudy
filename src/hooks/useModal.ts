// hooks/useModal.ts
import { ref } from 'vue';
interface ModalOptions {
  formInit?: Record<string, any>;
  submitApi?: (params: any) => Promise<any>;
  beforeSubmit?: (form: any) => boolean | void | Promise<boolean | void>;
  afterSubmit?: () => void;
}

export function useModal(options: ModalOptions = {}) {
  const visible = ref(false);
  const loading = ref(false);
  const form = ref(options.formInit || {});

  const show = () => visible.value = true;
  const close = () => visible.value = false;

  const setForm = (data: Record<string, any>) => {
    form.value = { ...form.value, ...data };
  };

  const submit = async () => {
    if (options.beforeSubmit) {
      const result = await options.beforeSubmit(form.value);
      if (result === false) return;
    }

    if (!options.submitApi) return;

    loading.value = true;
    try {
      await options.submitApi(form.value);
      close();
      options.afterSubmit?.();
    } finally {
      loading.value = false;
    }
  };

  return {
    visible,
    loading,
    form,
    show,
    close,
    setForm,
    submit
  };
}

