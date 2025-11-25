package com.sophie.veterinaria.entity.converter;

import com.sophie.veterinaria.entity.Mascota;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class SexoConverter implements AttributeConverter<Mascota.Sexo, String> {
  @Override
  public String convertToDatabaseColumn(Mascota.Sexo attribute) {
    if (attribute == null) return null;
    return attribute.name();
  }

  @Override
  public Mascota.Sexo convertToEntityAttribute(String dbData) {
    if (dbData == null || dbData.isBlank()) return Mascota.Sexo.macho;
    String v = dbData.trim().toLowerCase();
    try { return Mascota.Sexo.valueOf(v); } catch (Exception e) { return Mascota.Sexo.macho; }
  }
}