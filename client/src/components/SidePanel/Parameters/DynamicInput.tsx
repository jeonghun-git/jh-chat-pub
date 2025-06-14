import { OptionTypes } from 'librechat-data-provider';
import type { DynamicSettingProps } from 'librechat-data-provider';
import { useLocalize, useDebouncedInput, useParameterEffects, TranslationKeys } from '~/hooks';
import { Label, Input } from '~/components/ui';
import { useChatContext } from '~/Providers';
import { cn } from '~/utils';

function DynamicInput({
  label = '',
  settingKey,
  defaultValue,
  description = '',
  type = 'string',
  columnSpan,
  setOption,
  optionType,
  placeholder = '',
  readonly = false,
  showDefault = false,
  labelCode = false,
  descriptionCode = false,
  placeholderCode = false,
  conversation,
}: DynamicSettingProps) {
  const localize = useLocalize();
  const { preset } = useChatContext();

  const [setInputValue, inputValue, setLocalValue] = useDebouncedInput<string | number>({
    optionKey: optionType !== OptionTypes.Custom ? settingKey : undefined,
    initialValue: optionType !== OptionTypes.Custom ? conversation?.[settingKey] : defaultValue,
    setter: () => ({}),
    setOption,
  });

  useParameterEffects({
    preset,
    settingKey,
    defaultValue: typeof defaultValue === 'undefined' ? '' : defaultValue,
    conversation,
    inputValue,
    setInputValue: setLocalValue,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (type !== 'number') {
      setInputValue(e);
      return;
    }

    if (value === '') {
      setInputValue(e);
    } else if (!Number.isNaN(Number(value))) {
      setInputValue(e, true);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-start gap-2',
        columnSpan != null ? `col-span-${columnSpan}` : 'col-span-full',
      )}
    >
      <div className="grid w-full items-center gap-2">
        <div className="flex w-full justify-between">
          <Label
            htmlFor={`${settingKey}-dynamic-input`}
            className="text-left text-sm font-medium"
          >
            {labelCode ? localize(label as TranslationKeys) || label : label || settingKey}{' '}
            {showDefault && (
              <small className="opacity-40">
                (
                {typeof defaultValue === 'undefined' || !(defaultValue as string).length
                  ? localize('com_endpoint_default_blank')
                  : `${localize('com_endpoint_default')}: ${defaultValue}`}
                )
              </small>
            )}
          </Label>
        </div>
        <Input
          id={`${settingKey}-dynamic-input`}
          disabled={readonly}
          value={inputValue ?? defaultValue ?? ''}
          onChange={handleInputChange}
          placeholder={
            placeholderCode
              ? localize(placeholder as TranslationKeys) || placeholder
              : placeholder
          }
          className={cn(
            'flex h-10 max-h-10 w-full resize-none border-none bg-surface-secondary px-3 py-2',
          )}
        />
      </div>
    </div>
  );
}

export default DynamicInput;
